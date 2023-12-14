import { Spinner } from 'reactstrap';
import classnames from 'classnames';

type Props = {
    centered?: boolean,
    className?: string,
    children?: string | JSX.Element | JSX.Element[];
}

const Loader = ({ centered, children,className }: Props) => {
    return (
        <div className={classnames({ "text-center": centered }, className)}>
            <Spinner />
            <div className='mt-2'>{children}</div>
        </div>
    )
}

export default Loader