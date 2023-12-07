export interface JSONObject {
    [prop: string]: any
}

export interface I_Sedes {
    cod_empresa: number;
    cod_sede: number;
    est_pago: number;
    nomb_sede: string;
}

export interface I_Bill {
    cod_consecutivo: string;
    cod_contrato: string;
    cod_sede: number;
    dni_cliente: string;
    esta_pago: number;
    femi_factura: string;
    fven_factura: string;
    id_factura: number;
    integrity: string;
    marc_temp: string;
    marc_update: string;
    moneda: string;
    reference: string;
    valor_factura: string;
    valor: string;
    nomb_cliente: string;
    apel_cliente: string;
    plan_contrato: string;
}