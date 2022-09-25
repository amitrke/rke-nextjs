import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const fetchCountAPI = (req, res) => {
    const ref = firebase.database().ref('counts').child(req.query.id)

    return ref.once('value', (snapshot) => {
        res.status(200).json({
            total: snapshot.val()
        })
    })
}

export default fetchCountAPI;