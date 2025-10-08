import { useState, useEffect } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { getFirebaseDatabase } from '../../firebase/initFirebase'
import Button from 'react-bootstrap/Button'

const Counter = ({ id }) => {
    const [count, setCount] = useState('')
    useEffect(() => {
        const database = getFirebaseDatabase();
        const countRef = ref(database, `counts/${id}`);

        const unsubscribe = onValue(countRef, (snapshot) => {
            setCount(snapshot.val())
        })

        return () => {
            off(countRef, 'value', unsubscribe)
        }
    }, [id])

    const increaseCount = async () => {
        const registerCount = () => fetch(`/api/incrementCount?id=${encodeURIComponent(id)}`)
        registerCount()
    }

    return (
        <div style={{ margin: '5px 0' }}>
            <Button onClick={increaseCount} style={{ width: '100%' }}>Increase count</Button>
            <h5 style={{ textAlign: 'center', marginTop: '5px' }}>{count ? count : '0'}</h5>
        </div>
    )
}

export default Counter