import { Spinner } from 'reactstrap';
import classnames from 'classnames';

type Props = {
    centered?: boolean
}

const Loader = ({ centered }: Props) => {
    return (
        <div className={classnames({ "text-center": centered })}>
            <Spinner />
        </div>
    )
}

export default Loader