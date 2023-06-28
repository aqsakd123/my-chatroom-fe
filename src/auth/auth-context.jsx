import React, { useContext, useState, useEffect } from "react"
import {auth, db} from "../firebase"

const AuthContext = React.createContext({})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [userInfo, setUserInfo] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(currentUser?.uid) {
            const userInfo = db.collection('users').where('uid', '==', currentUser?.uid)
            userInfo.onSnapshot((snapshot) => {
                const documents = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUserInfo(documents[0])
            });
        }
    }, [currentUser?.uid])

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function loginByEmail(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function loginByPopup(provider) {
        return auth.signInWithPopup(provider)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    function updateProfile(profile) {
        return currentUser.updateProfile(profile)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userInfo,
        loginByEmail,
        loginByPopup,
        signup,
        logout,
        resetPassword,
        updateProfile,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}