import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DO_REQUEST from '../services/axiosService';
import { TRANSACTION_DATA } from '../services/endPointsService';
import Loader from '../components/Loader';
import { CheckCircleFill, ExclamationCircleFill, XCircleFill } from '../components/icons';
import { Button } from 'reactstrap';
import logo from './../assets/logologin.png';

type wompiResponseError = {
    error: {
        reason: string,
        type: "INVALID_ACCESS_TOKEN" | "NOT_FOUND_ERROR" | "INPUT_VALIDATION_ERROR"
    }
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
    const [data, setData] = useState<wompiResponseError>()

    const getTransactionData = (id: string) => {
        DO_REQUEST(TRANSACTION_DATA + id).then(r => {
            console.log(r)
            setData(r);
        }).catch(err => {
            setData(err.response.data);
            console.log(err)

        })
    }


    useEffect(() => {

        // id=128371-1702308096-82320&env=test

        const id = searchParams.get("id");

        if (!id) return navigate("/", { replace: true })

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
            <h1 className='text-success mb-4'><CheckCircleFill size={70} /></h1>
            {/* <h3>{data.}</h3> */}
            <p className='mt-4'>
                Descripción:
                {/* {data.error.reason} */}
            </p>
            <div>
                <Button color='primary' className='opacity-75 mt-4' onClick={() => navigate("/", { replace: true })}>Ok</Button>
            </div>
        </div>
    )
}

export default TransactionDetails