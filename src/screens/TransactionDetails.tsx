import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DO_REQUEST from '../services/axiosService';
import { TRANSACTION_DATA } from '../services/endPointsService';
import Loader from '../components/Loader';
import { CheckCircleFill, ExclamationCircleFill, XCircleFill } from '../components/icons';
import { Button, Table } from 'reactstrap';
import classnames from 'classnames';
import logo from './../assets/logologin.png';
import { currencyFormatter } from './BillDetails';

type WompiResponseError = {
    reason: string,
    type: "INVALID_ACCESS_TOKEN" | "NOT_FOUND_ERROR" | "INPUT_VALIDATION_ERROR"
}

type WompiDataResponse = {
    error?: WompiResponseError
    amount_in_cents: number;
    finalized_at: string;
    status: keyof typeof transaction_status;
    status_message: string;
    id: string;
    reference: string;
    currency: string;
    merchant: {
        legal_id: string;
        legal_id_type: string;
        legal_name: string;
    };
    payment_method: {
        extra: {
            transactionValue: number;
        },
        payment_description: string;
        type: string;
        user_legal_id: string;
        user_legal_id_type: string;
    }
}

const transaction_status = {
    "APPROVED": { text: "Pago Aprobado", icon: <CheckCircleFill size={70} />, className: "text-success" },
    "DECLINED": { text: "Pago Rechazado", icon: <XCircleFill size={70} />, className: "text-danger" },
    "VOIDED": { text: "Pago Anulado", icon: <ExclamationCircleFill size={70} />, className: "text-warning" },
    "ERROR": { text: "Error interno", icon: <ExclamationCircleFill size={70} />, className: "text-danger" }
}

const TransactionContent = ({ title, body, icon }: { title: string, body: string, icon: JSX.Element }) => {
    return <>
        <div className='mb-3 text-start'>
            <img src={logo} height={40} />
        </div>
        <h1 className='text-warning mb-4'>{icon}</h1>
        <h3>{title}</h3>
        <p className='mt-4'>{body}</p>
    </>
}

const TransactionDetails = () => {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate();
    const [data, setData] = useState<WompiDataResponse>()

    const getTransactionData = (id: string) => {
        DO_REQUEST(TRANSACTION_DATA + id).then(r => {
            setData(r.data);
        }).catch(err => {
            setData(err.response.data);
        })
    }

    useEffect(() => {
        const id = searchParams.get("id");

        if (!id) return navigate("/", { replace: true });

        getTransactionData(id)
    }, [])

    if (!data) {
        return <div>
            <Loader centered>Consultando transacción</Loader>
        </div>
    }

    if (data.error) {
        return <div className='text-center'>
            {
                data.error.type === "NOT_FOUND_ERROR" ?
                    <div className='position-relative'>
                        <TransactionContent
                            title="No se encontró la transacción."
                            body={`No se encontraron detalles de la transacción`}
                            icon={<i className='text-warning'><ExclamationCircleFill size={70} /></i>}
                        />
                        <div>
                            <Button color='primary' className='opacity-75 mt-4' onClick={() => navigate("/", { replace: true })}>Ok</Button>
                        </div>
                    </div>
                    :
                    <div>
                        <TransactionContent
                            title={data.error.type}
                            body={`Descripción: ${data.error.reason}`}
                            icon={<i className='text-danger'><XCircleFill size={70} /></i>}
                        />
                        <div>
                            <Button color='primary' className='opacity-75 mt-4' onClick={() => navigate("/", { replace: true })}>Ok</Button>
                        </div>
                    </div>
            }
        </div>
    }

    return (
        <div>
            <div className={classnames("mb-5 text-center", transaction_status[data.status].className)}>
                <h1>{transaction_status[data.status].icon}</h1>
                <h4 className='text-uppercase pt-2'>{transaction_status[data.status].text}</h4>
            </div>

            <div>
                <div className='mb-4'>

                    <div>
                        <small className='fw-bold'>EMPRESA</small>
                        <p>{data.merchant.legal_name}</p>
                    </div>
                    <div>
                        <small className='fw-bold'>{data.merchant.legal_id_type}</small>
                        <p>{data.merchant.legal_id}</p>
                    </div>

                </div>
                <Table bordered>
                    <tbody>
                        <tr>
                            <td>Valor</td>
                            <td>{currencyFormatter(data.currency).format(data.payment_method.extra.transactionValue || data.amount_in_cents)}</td>
                        </tr>
                        <tr>
                            <td>Fecha de pago</td>
                            <td>{data.finalized_at}</td>
                        </tr>
                        <tr>
                            <td>Metodo de pago</td>
                            <td>{data.payment_method.type}</td>
                        </tr>
                        <tr>
                            <td>Descripción de pago</td>
                            <td>{data.payment_method.payment_description}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div className='mt-5 d-flex justify-content-between align-items-end'>
                <div>
                    <img src={logo} height={50} />
                </div>
                <div className='text-end d-print-none'>
                    <Button color='link' className='opacity-75' onClick={() => window.print()}>Imprimir</Button>
                    <Button color='primary' className='opacity-75' onClick={() => navigate("/", { replace: true })}>Ok, cerrar</Button>
                </div>
            </div>
        </div>
    )
}

export default TransactionDetails