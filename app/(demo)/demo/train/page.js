"use client";

import { useState } from "react";

export default function TrainDemoPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("between"); // between, schedule, route

    const [formData, setFormData] = useState({
        from: "NDLS",
        to: "BCT",
        date: new Date().toISOString().split('T')[0],
        trainNo: "12952", // Example train number
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchBetweenStations = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await fetch(`/api/train?action=betweenStations&from=${formData.from}&to=${formData.to}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.data);
            setResult(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainOnDate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        // Format date to DD-MM-YYYY
        const [year, month, day] = formData.date.split('-');
        const formattedDate = `${day}-${month}-${year}`;

        try {
            const res = await fetch(`/api/train?action=getTrainOn&from=${formData.from}&to=${formData.to}&date=${formattedDate}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.data);
            setResult(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainRoute = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await fetch(`/api/train?action=getRoute&trainNo=${formData.trainNo}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.data);
            setResult(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">🚆 Train API Tester</h1>
                <p className="text-base-content/70">Test the Train API integration (eRail)</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="join">
                    <button
                        className={`join-item btn ${activeTab === 'between' ? 'btn-primary' : ''}`}
                        onClick={() => { setActiveTab('between'); setResult(null); setError(null); }}
                    >
                        Between Stations
                    </button>
                    <button
                        className={`join-item btn ${activeTab === 'schedule' ? 'btn-primary' : ''}`}
                        onClick={() => { setActiveTab('schedule'); setResult(null); setError(null); }}
                    >
                        Specific Date
                    </button>
                    <button
                        className={`join-item btn ${activeTab === 'route' ? 'btn-primary' : ''}`}
                        onClick={() => { setActiveTab('route'); setResult(null); setError(null); }}
                    >
                        Train Route
                    </button>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl mb-8 border border-base-200">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(activeTab === 'between' || activeTab === 'schedule') && (
                            <>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">From Station Code</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="from"
                                        value={formData.from}
                                        onChange={handleChange}
                                        placeholder="e.g. NDLS"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">To Station Code</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="to"
                                        value={formData.to}
                                        onChange={handleChange}
                                        placeholder="e.g. BCT"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'schedule' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Date</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                        )}

                        {activeTab === 'route' && (
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-medium">Train Number</span>
                                </label>
                                <input
                                    type="text"
                                    name="trainNo"
                                    value={formData.trainNo}
                                    onChange={handleChange}
                                    placeholder="e.g. 12952"
                                    className="input input-bordered w-full"
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-control mt-6">
                        {activeTab === 'between' && (
                            <button onClick={fetchBetweenStations} disabled={loading} className="btn btn-primary w-full">
                                {loading ? <span className="loading loading-spinner"></span> : "🔍 Search Trains"}
                            </button>
                        )}
                        {activeTab === 'schedule' && (
                            <button onClick={fetchTrainOnDate} disabled={loading} className="btn btn-primary w-full">
                                {loading ? <span className="loading loading-spinner"></span> : "📅 Check Schedule"}
                            </button>
                        )}
                        {activeTab === 'route' && (
                            <button onClick={fetchTrainRoute} disabled={loading} className="btn btn-primary w-full">
                                {loading ? <span className="loading loading-spinner"></span> : "📍 Get Route"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div role="alert" className="alert alert-error mb-8 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    {(activeTab === 'between' || activeTab === 'schedule') && Array.isArray(result) && (
                        <div className="grid grid-cols-1 gap-4">
                            {result.length === 0 ? (
                                <div className="alert alert-info">No trains found.</div>
                            ) : (
                                result.map((item, idx) => {
                                    const train = item.train_base;
                                    return (
                                        <div key={idx} className="card bg-base-100 shadow-md border border-base-200">
                                            <div className="card-body p-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{train.train_name} ({train.train_no})</h3>
                                                        <p className="text-sm text-base-content/70">
                                                            {train.from_stn_name} ({train.from_stn_code}) → {train.to_stn_name} ({train.to_stn_code})
                                                        </p>
                                                    </div>
                                                    <div className="badge badge-neutral">{train.travel_time}</div>
                                                </div>

                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="text-center">
                                                        <div className="font-bold text-xl">{train.from_time}</div>
                                                        <div className="text-xs">Departs</div>
                                                    </div>
                                                    <div className="flex-1 px-4 flex flex-col items-center">
                                                        <div className="w-full h-px bg-base-300"></div>
                                                        <div className="text-xs text-base-content/50 mt-1">Runs: {train.running_days}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-bold text-xl">{train.to_time}</div>
                                                        <div className="text-xs">Arrives</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {activeTab === 'route' && Array.isArray(result) && (
                        <div className="overflow-x-auto bg-base-100 rounded-lg shadow border border-base-200">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Station</th>
                                        <th>Code</th>
                                        <th>Arrive</th>
                                        <th>Depart</th>
                                        <th>Distance</th>
                                        <th>Day</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.map((stop, idx) => (
                                        <tr key={idx}>
                                            <td>{stop.source_stn_name}</td>
                                            <td><span className="badge badge-ghost">{stop.source_stn_code}</span></td>
                                            <td>{stop.arrive}</td>
                                            <td>{stop.depart}</td>
                                            <td>{stop.distance} km</td>
                                            <td>Day {stop.day}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="collapse collapse-arrow bg-base-100 border border-base-200 rounded-box">
                        <input type="checkbox" />
                        <div className="collapse-title text-xl font-medium">
                            📄 Raw JSON Response
                        </div>
                        <div className="collapse-content">
                            <pre className="bg-neutral text-neutral-content p-4 rounded-lg overflow-auto max-h-96 text-xs">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
