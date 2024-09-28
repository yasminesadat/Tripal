const ActivityCategoryDetails = ({ activityCategory }) => {
    return (
        <div >
            <h2>
                Activity Categories
            </h2>
            <div>
                <p> <strong> Name: {activityCategory.Name} </strong></p>
            </div>

        </div>
    )
}
export default ActivityCategoryDetails