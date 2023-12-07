import { useState } from 'react'
import { I_Bill } from '../interfaces/general.interface'

const useBillData = () => {
    const [billData, setBillData] = useState<null | I_Bill | false>(null)
    return { billData, setBillData }
}

export default useBillData