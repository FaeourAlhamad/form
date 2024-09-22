import { Injectable } from '@angular/core';

export interface formAuthFormConfig {
  path?: string;
  form?: string;
  component?: any;
}

export interface formAuthRouteConfig {
  auth?: any;
  login?: any;
  register?: any;
  resetpass?: any;
}

@Injectable()
export class formAuthConfig {
  component?: any;
  delayAuth?: any;
  login?: formAuthFormConfig;
  register?: formAuthFormConfig;
  resetpass?: formAuthFormConfig;
  oauth?: formOAuthConfig;
}


export interface formOAuthConfig {
  type: formOauthType;
  options: formOktaConfig | formSamlConfig;
}

export enum formOauthType {
  okta = 'okta',
  saml = 'saml',
}

export interface formOktaConfig extends OktaConfig {
  form?: any;
}

export interface formSamlConfig {
  relay: string;
}

// for more details about Okta configuration options see https://github.com/okta/okta-auth-js#configuration-reference
export interface OktaConfig {
  url?: string;
  tokenManager?: OktaTokenManagerConfig;
  issuer?: string;
  clientId?: string;
  redirectUri?: string;
  postLogoutRedirectUri?: string;
  pkce?: boolean;
  authorizeUrl?: string;
  userinfoUrl?: string;
  tokenUrl?: string;
  ignoreSignature?: boolean;
  maxClockSkew?: number;
  scopes?: string[];
  httpRequestClient?: Function;
}

export interface OktaTokenManagerConfig {
  storage?: string | {
    getItem?: Function;
    setItem?: Function;
  };
  secure?: boolean;
  autoRenew?: boolean;
  expireEarlySeconds?: number;
  storageKey?: string;
}
