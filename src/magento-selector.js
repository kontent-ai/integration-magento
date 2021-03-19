var currentValue = null;
var isDisabled = true;
var config = null;

function updateDisabled(disabled) {
    var elements = $(".search").add(".clear");
    if (disabled) {
        elements.hide();
    } else {
        elements.show();
    }
    updateSize();
    isDisabled = disabled;
}

function renderSelected(value) {
    var $selected = $(".selected").empty();
    var $titleText = $(".title").find(".text");
    var $clear = $(".clearbtn").hide();
    if (value && value.id && value.title) {
        $titleText.text('Selected product');
        $titleText.addClass('text--is-selected')
        $clear.show();
        productTile($selected, value);
    } else {
        $titleText.text('No product selected');
        $titleText.removeClass('text--is-selected')
    }
    updateSize();
}

function updateValue(value) {
    // Send updated value to Kentico (send null in case of the empty string => element will not meet required condition).
    if (!isDisabled) {
        if (value && value.id) {
            currentValue = value;
            CustomElement.setValue(JSON.stringify(value));
            renderSelected(value);
        }
        else {
            currentValue = null;
            CustomElement.setValue(null);
            renderSelected(null);
        }
    }
}

function getData(searchTerm, callback) {
    let data = { query: searchTerm };

    $.ajax({
        method: "POST",
        url: "/.netlify/functions/magento-client",
        dataType: "json",
        contentType: 'application/json',
        headers: {
            "x-root-url": config.storeUrl,
            "x-url-key": config.urlKeyAttribute || 'url_key'
        },
        data: JSON.stringify(data),
        success: function (response) {
            callback(response);
        },
        error: function (error) {
            console.error(error);
        }
    });
}


function productTile($parent, item, select) {
    var $tile = $(`<div class="tile" title="${item.title}"></div>`)
        .appendTo($parent);

    $(`<div class="title">${item.title}</div>`).appendTo($tile);
    $(`<div class="id">SKU: ${item.sku || 'N/A'} </div>`).appendTo($tile);

    if (item.previewUrl) {
        $('<img class="preview" />')
            .attr("src", item.previewUrl)
            .appendTo($tile)
            .on('load', updateSize);
    }
    else {
        $('<div class="noimage">No image available</div>')
            .appendTo($tile);
    }

    if (select) {
        $tile
            .attr('tabindex', 0)
            .keypress(function (e) {
                if (e.which == 13) {
                    select();
                }
            })
            .click(function () {
                select();
            });
    }

    updateSize();
}

function search() {
    var searchTerm = $("input.searchterm").val();
    getData(
        searchTerm,
        function (items) {
            var $results = $(".results").empty().show();

            $(`<h4>Search results (${items.length})</h4>`).appendTo($results);

            $.each(
                items,
                (i, item) => {
                    if (i >= 10) {
                        return false;
                    }

                    var value = item;

                    var select = () => {
                        updateValue(value);
                        clearSearch();
                    };

                    productTile($results, item, select);
                }
            );
        }
    );
}

function clearSearch() {
    $(".results").empty().hide();
    $("input.searchterm").val('');
    updateSize();
}

function setupSelector(value) {
    $("form.searchform").submit(function (e) {
        e.preventDefault();
        $('input.searchterm').focus();
        search();
    });

    $("button.clearbtn").click(function (e) {
        e.preventDefault();
        $('input.searchterm').focus();
        updateValue(null);
    });

    $("button.clearsearchbtn").click(function (e) {
        e.preventDefault();
        $('input.searchterm').focus();
        clearSearch();
    });

    if (value) {
        currentValue = JSON.parse(value);
        renderSelected(currentValue);
    }
    else {
        renderSelected(null);
    }

    window.addEventListener('resize', updateSize);
}

function updateSize() {
    // Update the custom element height in the Kentico UI.
    const height = Math.ceil($("html").height());
    CustomElement.setHeight(height);
}

function validateConfig() {
    if (!config.storeUrl) {
        console.error('Missing Magento Endpoint URL. Please provide the URL of the endpoint for querying products within the custom element JSON config.')
    }
}

function initCustomElement() {
    $('.results').hide();
    $('.clearbtn').hide();
    updateSize();

    try {
        CustomElement.init((element, _context) => {
            // Setup with initial value and disabled state
            config = element.config || {};
            validateConfig();
            updateDisabled(element.disabled);
            setupSelector(element.value);
            updateSize();
        });

        // React on disabled changed (e.g. when publishing the item)
        CustomElement.onDisabledChanged(updateDisabled);
    } catch (err) {
        // Initialization with Kentico Custom element API failed (page displayed outside of the Kentico UI)
        console.error(err);
        setupSelector();
        updateDisabled(true);
    }
}

initCustomElement();
