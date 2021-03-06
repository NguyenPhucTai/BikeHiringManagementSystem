import React, {useState, useEffect} from 'react';
import Alert from 'react-bootstrap/Alert';

export const AlertMessage = (props) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (props.isShow){
            setShow(true);
        }
    }, [props.isShow])
    if (show) {
        return (
            <Alert variant={props.status} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Alert!</Alert.Heading>
                <p>{props.message}</p>
            </Alert>
        )
    }
}