import magentoLogo from './magento_logo.png'
import { FC } from "react";

export const PoweredByLogo: FC = () => (
  <div style={{ float: 'right', padding: 10 }}>
    <span style={{ paddingRight: 5 }}>powered by</span>
    <img
      height={40}
      src={magentoLogo}
      alt="Magento logo"
      title="Magento logo"
    />
  </div>
);

PoweredByLogo.displayName = 'PoweredByLogo';
