import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useUser } from '../../firebase/useUser';
import Button from 'react-bootstrap/Button';

const ReadDataFromCloudFirestore = (): JSX.Element => {
    const { user } = useUser();
    const readData = () => {
        if (!user) {
            alert('Please log in to read data.');
            return;
        }
        try {
            firebase
                .firestore()
                .collection('myCollection')
                .doc(user.id)
                .onSnapshot((doc) => {
                    console.log(doc.data());
                });
            alert(
                'Data was successfully fetched from cloud firestore! Close this alert and check console for output.'
            );
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };

    return (
        <div style={{ margin: '5px 0' }}>
            <Button onClick={readData} style={{ width: '100%' }}>
                Read Data From Cloud Firestore
            </Button>
        </div>
    );
};

export default ReadDataFromCloudFirestore;
