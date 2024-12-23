import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { data, useParams } from 'react-router-dom';
import './BookingCard.css'
import moment from 'moment';



const BookingCard = () => {
    const [room, setRoom] = useState({});
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const user = JSON.parse(localStorage.getItem("currentUser"))
    const { roomid } = useParams();
    const { fromDate } = useParams();
    const { toDate } = useParams();
    const formattedFromDate = moment(fromDate, 'DD-MM-YYYY')
    const formattedToDate = moment(toDate, 'DD-MM-YYYY')
    const totalDays = formattedToDate.diff(formattedFromDate, 'days') + 1
    const [totalAmount, setTotalAmount] = useState()


    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const response = await axios.post('/api/rooms/getroombyid', { roomid: roomid });
                const data = await response.data
                setRoom(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                console.error(error);
                setLoading(false);
            }
        };

        fetchRoom(); // Call the async function
    }, [roomid]);



    useEffect(() => {
        if (room.rentPerDay && totalDays) {
            setTotalAmount(room.rentPerDay * totalDays); // Calculate the total amount
        }
    }, [room.rentPerDay, totalDays]);



    const bookRoom = async () => {

        const bookingDetails = {
            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromDate,
            toDate,
            totalAmount,
            totalDays
        }

        try {
            const result = await axios.post('/api/bookings/bookroom', bookingDetails)
            alert('Room Booked Successfully')
            window.location.href = '/user-profile'
        } catch (error) {

        }

    }
    return (
        <>
            {loading ? (<h1>Loading....</h1>) : error ? (<h1>Error....</h1>) : (
                <div className="booking-card-container">
                    <div className="booking-card-left">
                        <div className="booking-card-room-title">
                            {room.roomTitle}
                        </div>
                        <div className="booking-card-room-image">
                            <img src={room.imageUrls[0]} alt="img" />
                        </div>
                    </div>
                    <div className="booking-card-right">

                        <div className="booking-card-details-head">
                            <h1>Booking Details</h1>
                        </div>
                        <hr />
                        <div className="booking-card-username">
                            <span>Name : </span>
                            <span>{user.username} </span>
                        </div>
                        <div className="booking-card-from-date">
                            <span>From : </span>
                            <span> {fromDate} </span>
                        </div>
                        <div className="booking-card-to-date">
                            <span>To : </span>
                            <span> {toDate} </span>
                        </div>
                        <div className="booking-card-max-guest">
                            <span>Max Guests : </span>
                            <span>{room.maxCount} </span>
                        </div>

                        <div className="booking-card-payment-head">
                            <h1>Amount</h1>
                        </div>
                        <hr />
                        <div className="booking-card-total-days">
                            <span>Total Days : </span>
                            <span>{totalDays} </span>
                        </div>
                        <div className="booking-card-rentPerDay">
                            <span className='blue txt-1-5' >{room.rentPerDay} </span>
                            <span className='gray txt-1' >₹/Night</span>
                        </div>
                        <div className="booking-card-totalAmount">
                            <span>Total amount : </span>
                            <span className='blue txt-1-5' >{totalAmount} </span>
                            <span>₹/-</span>
                        </div>
                        <div className="booking-card-payment-button">
                            <button onClick={bookRoom}> Pay Now</button>
                        </div>


                    </div>
                </div>
            )}
        </>
    )
}

export default BookingCard