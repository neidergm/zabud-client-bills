import React, { useContext, useEffect, useState, useRef } from 'react'
import { Form, FormGroup, Label, Input, Button, FormFeedback, UncontrolledAlert } from 'reactstrap'
import DO_REQUEST from '../services/axiosService';
import { CONTRACT_BILL, SEDES } from '../services/endPointsService';
import { I_Sedes, JSONObject } from '../interfaces/general.interface';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import classnames from "classnames";

import logo from './../assets/logologin.png';
import { ArrowRightCircleFill, ExclamationCircleFill } from '../components/icons';
import { billContext } from '../App';
import { CAPTCHA_KEY } from '../services/constantsService';

const SearchBill = () => {
    const {
        billData,
        setBillData,
        captchaSuccess,
        setCaptchaSuccess,

    } = useContext(billContext)
    const [sedes, setSedes] = useState<I_Sedes[]>();
    const [loader, setLoader] = useState<string>();
    const [errors, setErrors] = useState<JSONObject>({});

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [captchaLoaded, setCaptchaLoaded] = useState(false);

    const navigate = useNavigate();

    const search = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loader || !captchaSuccess) return null;

        const errors: JSONObject = {};

        const sede = e.currentTarget.sede.value;
        const bill = e.currentTarget.bill.value;

        if (!sede) errors["sede"] = "Campo obligatorio";
        if (!bill) errors["bill"] = "Campo obligatorio";

        setBillData(null);
        if (Object.keys(errors).length) {
            return setErrors(errors)
        }

        setLoader("Consultando factura")

        DO_REQUEST(`${CONTRACT_BILL}/${bill}?sede=${sede}`).then(r => {
            if (r.cod === "200") {
                setBillData(r.data);
                navigate(`factura/${sede}/${bill}`)
            } else {
                setBillData(false)
            }
        }).finally(() => { setLoader(undefined) })
    }

    const validateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            setErrors(er => ({ ...er, [e.target.name]: "Campo requerido" }))
        } else {
            if (errors[e.target.name]) {
                setErrors((er) => {
                    delete er[e.target.name]
                    return { ...er }
                })
            }
        }
    }

    const onCaptchaChange = (value: null | string) => {
        setCaptchaSuccess(value)
    }

    useEffect(() => {
        DO_REQUEST(SEDES).then((r) => {
            setSedes(r.data)
        })
    }, [])

    return (
        <div>
            <div className='text-center mb-5'>
                <h4>PORTAL DE PAGOS</h4>
            </div>
            <div className='search-bill-screen d-flex flex-column flex-md-row align-items-center gap-5'>
                <div className="text-center w-100">
                    <div className="text-center">
                        <img src={logo} height={100} />
                    </div>
                </div>
                <div className='vr bg-secondary d-none d-md-block'></div>
                <div className='w-100 my-md-5 my-3'>
                    {billData === false && <div className='pe-md-4'>
                        <UncontrolledAlert color="danger" className='bg-danger text-white border-0'>
                            <ExclamationCircleFill /> No se encontró factura
                        </UncontrolledAlert>
                    </div>}
                    {!sedes ? <Loader centered /> : (
                        <Form onSubmit={search} className='pe-md-4'>
                            <FormGroup className='mb-4'>
                                <Label for="sede">
                                    Sede
                                </Label>
                                <Input
                                    id="sede"
                                    name="sede"
                                    type="select"
                                    disabled={!!loader}
                                    invalid={!!errors["sede"]}
                                    onChange={validateValue}
                                >
                                    <option value="">Seleccione...</option>
                                    {sedes.map(s =>
                                        <option value={s.cod_sede} key={s.cod_sede}>{s.nomb_sede}</option>
                                    )}
                                </Input>
                                <FormFeedback>{errors["sede"]}</FormFeedback>

                            </FormGroup>
                            <FormGroup className='mb-5'>
                                <Label for="bill">
                                    Número de factura
                                </Label>
                                <Input
                                    id="bill"
                                    name="bill"
                                    placeholder=""
                                    type="number"
                                    disabled={!!loader}
                                    invalid={!!errors["bill"]}
                                    onChange={validateValue}
                                    min={0}
                                />
                                <FormFeedback >{errors["bill"]}</FormFeedback>
                            </FormGroup>
                            <div className='text-center'>
                                {!captchaLoaded && <Loader />}
                                <ReCAPTCHA
                                    className={classnames('justify-content-center', captchaSuccess ? 'd-none' : 'd-flex')}
                                    ref={recaptchaRef}
                                    // onErrored={() => setCaptchaLoaded(null)}
                                    //  onExpired={() => { setFormStatus(0) }}
                                    asyncScriptOnLoad={() => setCaptchaLoaded(true)}
                                    sitekey={CAPTCHA_KEY}
                                    size="normal"
                                    onChange={onCaptchaChange}
                                />
                                {captchaSuccess && (loader ? <Loader /> :
                                    <Button color="success" disabled={!!loader}>
                                        <span>Consultar
                                            <i className='ms-2'><ArrowRightCircleFill /></i>
                                        </span>
                                    </Button>
                                )}
                            </div>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchBill