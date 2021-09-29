import WriteToCloudFirestore from '../components/cloudFirestore/Write'
import ReadDataFromCloudFirestore from '../components/cloudFirestore/Read'
import { useUser } from '../firebase/useUser'
import Counter from '../components/realtimeDatabase/Counter'
import UploadFile from '../components/storage/UploadFile'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import styles from '../styles/Home.module.css'

export default function MyAccount() {
    const { user } = useUser()

    if (user) {
        return (
          <>
            <Card>
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <Card.Text>{user.email}</Card.Text>
                <hr />
                {user.profilePic ? <image src={user.profilePic} height={100} width={100}></image> : <p>No profile pic.</p>}
                <hr />
                <WriteToCloudFirestore />
                <ReadDataFromCloudFirestore />
                <hr />
                <Counter id={user.id} />
                <hr />
                <UploadFile />
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button onClick={() => logout()} style={{ width: '100px' }}>Log Out</Button>
                  <a href="https://github.com/bjcarlson42/nextjs-with-firebase" target="_blank">
                    <Button variant="outline-secondary" style={{ width: '100px' }}>Code</Button>
                  </a>
                </div>
              </Card.Body>
            </Card>
          </>
        )
    }
    else {
        return(<div className={styles.container}>
            Please login to view the contents of this page.
        </div>);
    }
}