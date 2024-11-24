
import {  useEffect, useState } from "react";
import { tourismGovernerID } from '../../IDs';
import { getAllHistoricalPlacesByTourismGoverner, deleteHistoricalPlace } from '../../api/HistoricalPlaceService';
import Maps from '../../components/historicalplace/Maps';
import { toast } from 'react-toastify';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {  useNavigate } from "react-router-dom";
import GovernorNavBar from "../../components/navbar/GovernorNavBar";

const HistoricalPlacesList = () => {
    const [governerHistoricalPlace, setGovernerHistoricalPlace] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const getHistoricalPlacesByGoverner = async (id) => {
            setLoading(true);
            try {
                const result = await getAllHistoricalPlacesByTourismGoverner(id);
                if (result) {
                    console.log("result: ", result);
                    setGovernerHistoricalPlace(result);
                }
                setLoading(false);
            } catch (e) {
                setLoading(false);
                toast.error('Error while fetching')
            }
        }
        getHistoricalPlacesByGoverner(tourismGovernerID)
    }, []);
    const handleDelete = async (id) => {
        try {
            const response = await deleteHistoricalPlace(id);
            if (response) {
                toast.success('Historical place deleted successfully')
                setGovernerHistoricalPlace(governerHistoricalPlace.filter(place => place._id !== id));
            }
        }
        catch (e) {
            toast.error('Doesnt found')
        }
    }


    return (
        <div>
            <GovernorNavBar />
            <div className="list" >
                {governerHistoricalPlace.length > 0 ?
                    governerHistoricalPlace.map((place) => (
                        <div className="list-item" key={place._id}>
                            <div className="list-item-header">{place.name}
                                <div style={{ display: 'inline-block', marginLeft: 'auto' }}>
                                    <EditOutlined
                                        onClick={() => {
                                            navigate(`/historicalPlace/${place._id}`, { state: { place } })
                                        }}

                                        style={{ color: 'white', marginRight: '10px', cursor: 'pointer' }}
                                    />
                                    <DeleteOutlined
                                        onClick={() => handleDelete(place._id)}
                                        style={{ color: 'red', cursor: 'pointer' }}
                                    />
                                    
                                </div>
                            </div>
                            <div className="list-item-attributes">
                                <div className="list-item-attribute">{place.description}</div>
                                {place.images && place.images.length > 0 && (
                                    <div className="list-item-attribute">
                                        <div>Pictures:</div>
                                        {place.images.map((image,idx) => (<img
                                            key ={`Image ${idx+1}`}
                                            src={image.url}
                                            alt={place.name}
                                            style={{ width: "200px" }}
                                        />))}
                                    </div>
                                )}
                                <div className="list-item-attribute">Location: {place.location.address}</div>
                                < Maps selectPosition={{ lat: place.location.coordinates.latitude, lon: place.location.coordinates.longitude }} />
                                <div className="list-item-attribute">
                                    Opening Hours: Weekdays {place.openingHours.weekdays.openingTime} -{" "}
                                    {place.openingHours.weekdays.closingTime}, Weekends{" "}
                                    {place.openingHours.weekends.openingTime} -{" "}
                                    {place.openingHours.weekends.closingTime}
                                </div>
                                <div className="list-item-attribute">
                                    Ticket Prices: Foreigner: ${place.ticketPrices.foreigner}, Native: $
                                    {place.ticketPrices.native}, Student: ${place.ticketPrices.student}
                                </div>
                                <div className="list-item-attribute">
                                    Tags:{" "}
                                    {place.tags && place.tags.length > 0
                                        ? place.tags.map((tag) => tag.name).join(", ")
                                        : "N/A"}
                                </div>
                                <div className="list-item-attribute">
                                    Historical periods:{" "}
                                    {place.historicalPeriod && place.historicalPeriod.length > 0
                                        ? place.historicalPeriod.map((period) => period.name).join(", ")
                                        : "N/A"}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div>No historical places found</div>
                    )}
            </div>
        </div>
    );
};

export default HistoricalPlacesList;