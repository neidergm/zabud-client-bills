import React, { useContext, useEffect, useState, useRef } from 'react'
import { Form, FormGroup, Label, Input, Button, FormFeedback, UncontrolledAlert, Row, Col } from 'reactstrap'
import DO_REQUEST from '../services/axiosService';
import { CONTRACT_BILL, CONTRACT_BILL_BY_DNI, SEDES } from '../services/endPointsService';
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

    const [formData, setFormData] = useState({
        searchType: "dni",
        location: "",
        number: ""
    })

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [captchaLoaded, setCaptchaLoaded] = useState(false);

    const navigate = useNavigate();

    const search = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loader || !captchaSuccess) return null;

        const errors: JSONObject = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (!value) errors[key] = "Campo obligatorio"
        })

        setBillData(null);
        const ks = Object.keys(errors);
        if (ks.length) {
            e.currentTarget[ks[0]].focus();
            return setErrors(errors)
        }

        setLoader("Consultando factura");

        const isDNI = formData.searchType === "dni"

        DO_REQUEST(`${ isDNI ? CONTRACT_BILL_BY_DNI : CONTRACT_BILL}/${formData.number}?sede=${formData.location}`)
            .then(r => {
                if (r.cod === "200") {
                    const d = isDNI ? r.data[0] : r.data
                    setBillData(d);
                    navigate(`factura/${formData.location}/${d.cod_contrato}`)
                } else {
                    setBillData(false)
                }
            }).finally(() => { setLoader(undefined) })
    }

    // const validateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.value) {
    //         setErrors(er => ({ ...er, [e.target.name]: "Campo requerido" }))
    //     } else {
    //         if (errors[e.target.name]) {
    //             setErrors((er) => {
    //                 delete er[e.target.name]
    //                 return { ...er }
    //             })
    //         }
    //     }
    // }

    const onCaptchaChange = (value: null | string) => {
        setCaptchaSuccess(value)
    }

    const onFormChange = ({ target }: React.ChangeEvent<HTMLInputElement>, clearElement?: string) => {
        if (errors[target.name] && !!target.value) {
            setErrors(({ [target.name]: n, ...r }) => ({ ...r }))
        }

        setFormData(fd => {
            if (clearElement) (fd as any)[clearElement] = "";
            return { ...fd, [target.name]: target.value }
        })
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
                                    id="location"
                                    name="location"
                                    type="select"
                                    disabled={!!loader}
                                    invalid={!!errors["location"]}
                                    onChange={onFormChange}
                                    value={formData.location}
                                >
                                    <option value="">Seleccione...</option>
                                    {sedes.map(s =>
                                        <option value={s.cod_sede} key={s.cod_sede}>{s.nomb_sede}</option>
                                    )}
                                </Input>
                                <FormFeedback>{errors["location"]}</FormFeedback>

                            </FormGroup>

                            <Row>
                                <Col md={4} className='pe-0'>
                                    <FormGroup>
                                        <Label for="searchType">Buscar por</Label>
                                        <Input
                                            id="searchType"
                                            name="searchType"
                                            type="select"
                                            value={formData.searchType}
                                            onChange={e => {
                                                onFormChange(e, "number")
                                            }}
                                        >
                                            <option value="dni">CC</option>
                                            <option value="contract">Contrato</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col className='ps-md-1'>
                                    <FormGroup className='mb-5'>
                                        <Label for="bill">
                                            Número de {formData.searchType === "dni" ? "identificación" : "contrato"}
                                        </Label>
                                        <Input
                                            id="number"
                                            name="number"
                                            placeholder=""
                                            type="number"
                                            disabled={!!loader}
                                            invalid={!!errors["number"]}
                                            onChange={onFormChange}
                                            min={0}
                                            value={formData.number}
                                        />
                                        <FormFeedback >{errors["number"]}</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>

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