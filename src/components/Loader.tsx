import { Spinner } from 'reactstrap';
import classnames from 'classnames';

type Props = {
    centered?: boolean,
    children?: string | JSX.Element | JSX.Element[];
}

const Loader = ({ centered, children }: Props) => {
    return (
        <div className={classnames({ "text-center": centered })}>
            <Spinner />
            <div className='mt-3'>{children}</div>
        </div>
    )
}

export default Loader