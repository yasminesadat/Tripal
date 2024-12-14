export default function MainInformation({name}) {
    return (
        <>
            <div className="row y-gap-20 justify-between items-end">
                <div className="col-auto">
                    <div className="row x-gap-10 y-gap-10 items-center">
                        <div className="col-auto">
                            <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                                Bestseller
                            </button>
                        </div>
                        <div className="col-auto">
                            <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
                                Free cancellation
                            </button>
                        </div>
                    </div>

                    <h2 className="text-40 sm:text-30 lh-14 mt-20">
                        {name}
                    </h2>

                    <div className="row x-gap-20 y-gap-20 items-center pt-20">
                      
                    </div>
                </div>               
            </div>
        </>
    );
}
