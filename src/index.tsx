import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { EnsureKontentAsParent } from "./EnsureKontentAsParent";
import { MagentoProductSelector } from "./MagentoProductSelector";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <EnsureKontentAsParent>
      <MagentoProductSelector />
    </EnsureKontentAsParent>
  </React.StrictMode>
);
