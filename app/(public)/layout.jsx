'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProduct } from "@/lib/features/product/productSlice";

export default function PublicLayout({ children }) {
    const dispatch = useDispatch();

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/product/all')
            const data = await res.json()
            if (data.success) {
                dispatch(setProduct(data.products))
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}