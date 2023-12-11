import { useContext, useEffect, useRef } from 'react';
import { I_Bill } from '../interfaces/general.interface';
import { Table, Button } from 'reactstrap';
import { WOMPI_KEY, WOMPI_REDIRECTION_URL } from '../services/constantsService';
import { CheckCircleFill, XCircleFill } from './../components/icons';
import { billContext } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { CONTRACT_BILL } from '../services/endPointsService';
import DO_REQUEST from '../services/axiosService';
import Loader from '../components/Loader';

const currencyFormatter = (currency = "COP") => new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});


const BillDetails = () => {

    const { billData, setBillData } = useContext(billContext);
    const data = billData as I_Bill;
    const { id_sede, id_contract } = useParams();
    const navigate = useNavigate();

    const wompiBtnRef = useRef<HTMLFormElement | null>(null);

    const goBack = () => {
        setBillData(null);
        navigate('/');
    }

    const loadWompiBtn = () => {
        if (!wompiBtnRef.current) return null;

        const script = document.createElement('script');

        if (data.esta_pago !== 1) {
            script.src = "https://checkout.wompi.co/widget.js";
            script.setAttribute("data-render", "button")
            script.setAttribute("data-public-key", WOMPI_KEY)
            script.setAttribute("data-currency", data.moneda)
            script.setAttribute("data-amount-in-cents", data.valor_factura)
            script.setAttribute("data-reference", data.reference)
            script.setAttribute("data-signature:integrity", data.integrity)

            script.setAttribute("data-redirect-url", WOMPI_REDIRECTION_URL)
        }

        wompiBtnRef.current.innerHTML = "";
        wompiBtnRef.current.appendChild(script);
        wompiBtnRef.current = null;
    }

    // const getTransactionDetails = () => {
    //     DO_REQUEST()
    // }

    useEffect(() => {
        if (!data) {
            if (!!id_contract && !!id_sede) {
                DO_REQUEST(`${CONTRACT_BILL}/${id_contract}?sede=${id_sede}`).then(r => {
                    if (r.cod === "200") {
                        return setBillData(r.data);
                    } else {
                        return navigate(`/`, { replace: true })
                    }
                })
            } else {
                return navigate(`/`, { replace: true })
            }
        }

        loadWompiBtn()
    }, [data])


    if (!data) {
        return <div className='p-5 text-center'>
            <Loader centered />
            <p className='small mt-4'>Consultando datos de factura</p>
            <p className='small'>Por favor espere</p>
        </div>
    }

    return (
        <div className='px-md-5 py-3'>
            <div className='position-absolute top-0 end-0 p-4'>
                <Button color='link' className='link-secondary' onClick={goBack}>
                    <XCircleFill size={20} />
                </Button>
            </div>
            <div>
                <h1>¡Hola!</h1>
                <p>{data.nomb_cliente} {data.apel_cliente}, estos son los detalles de la factura de tu plan</p>
            </div>

            <div className='mt-5'>
                <Table bordered>
                    <thead>
                        <tr>
                            <th colSpan={2} className='py-3 text-center'>
                                {data.plan_contrato}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='fw-semibold'>Contrato</td>
                            <td>{data.cod_contrato}</td>
                        </tr>
                        <tr>
                            <td className='fw-semibold'>Estado</td>
                            <td className={data.esta_pago === 1 ? "table-success" : ""}>
                                {data.esta_pago === 1 ? <b className='text-success'>
                                    <i className='me-2'><CheckCircleFill /></i>PAGADA
                                </b> : "PENDIENTE DE PAGO"}
                            </td>
                        </tr>
                        <tr>
                            <td className='fw-semibold'>Valor a pagar</td>
                            <td>{currencyFormatter(data.moneda).format(Number(data.valor))}</td>
                        </tr>
                        <tr>
                            <td className='fw-semibold'>Fecha de emisión</td>
                            <td>{data.femi_factura}</td>
                        </tr>
                        <tr>
                            <td className='fw-semibold'>Fecha de vencimiento</td>
                            <td>{data.fven_factura}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div className='mt-5'>
                <form ref={wompiBtnRef}>
                    <div className='d-flex aling-items-center gap-3'>

                        {<Loader />}
                        <div>
                            <span>Espere un momento</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BillDetails