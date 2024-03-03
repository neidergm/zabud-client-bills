/**
 * @method GET
 */
export const SEDES = `pago/sedes`

/**
 * @method GET
 * @params /{contrato}?sede={codi_sede}
*/
export const CONTRACT_BILL = `pago`

/**
 * @method GET
 * @params /{user_dni}?sede={codi_sede}
*/
export const CONTRACT_BILL_BY_DNI = `pago/cliente`

/**
 * @method GET
 * @params /ID_TRANSACCION
*/
export const TRANSACTION_DATA = `https://production.wompi.co/v1/transactions/`