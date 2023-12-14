import { useState } from 'react'

export type T_Captcha = ReturnType<typeof useCaptcha>;

const useCaptcha = () => {
    const [captchaSuccess, setCaptchaSuccess] = useState<string | null>(null);

    return {
        captchaSuccess,
        setCaptchaSuccess
    }
}

export default useCaptcha