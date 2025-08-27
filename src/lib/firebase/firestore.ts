// services/firestore.ts
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";



export const loginUser = async (email: string, password: string): Promise<any> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // Mengembalikan user setelah berhasil login
    } catch (error) {
        console.error("Login gagal:", error);
        throw new Error("Login gagal. Periksa email dan kata sandi Anda.");
    }
};

export const registerUser = async (email: string, password: string, name: string): Promise<any> => {
    try {
        // Registrasi user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan data user ke Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            name: name, // ← tambahkan name di sini
            createdAt: serverTimestamp(),
            role: 'user'
        });

        return user;
    } catch (error) {
        console.error("Registrasi gagal:", error);
        throw new Error("Registrasi gagal. Periksa kembali data yang Anda masukkan.");
    }
};


