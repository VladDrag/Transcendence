declare module 'react-oauth2-hook' {
	interface OAuth2Config {
	  authorizationUrl: string;
	  redirectUri: string;
	  clientId: string;
	}
  
	interface OAuth2Result {
	  isFetching: boolean;
	  isAuthenticated: boolean;
	  clientId: string;
	}
  
	export default function useOAuth2(config: OAuth2Config): OAuth2Result;
  }