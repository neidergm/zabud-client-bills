import config from "../../public/config.json";

export const API_BASE = config.api;
export const CAPTCHA_KEY = config.captcha;
export const WOMPI_KEY = config.wopmpi_key;
export const WOMPI_REDIRECTION_URL = config.wompi_redirection || `${window.location.origin}/transaccion`;
