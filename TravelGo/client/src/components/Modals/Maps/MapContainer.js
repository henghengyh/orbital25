export default function MapContainer({
    isLoaded,
    mapRef,
    customPopup,
    hideCustomPopup,
    getGradientByActivityType,
}) {
    return (
        <div className="w-full h-[700px] border border-gray-300 rounded-lg overflow-hidden relative">
            {!isLoaded ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading map...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div ref={mapRef} className="w-full h-full" />
                    {customPopup && customPopup.visible && (
                        <div 
                            className="absolute z-50 pointer-events-none"
                            style={{
                                left: '50%',
                                top: '30%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div 
                                className="pointer-events-auto"
                                style={{
                                    maxWidth: '280px',
                                    background: getGradientByActivityType(customPopup.activity.type),
                                    borderRadius: '12px',
                                    color: 'white',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                }}
                            >
                                <button
                                    onClick={hideCustomPopup}
                                    className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-40 transition-all"
                                    style={{ fontSize: '14px' }}
                                >
                                    ×
                                </button>
                                <button
                                    onClick={hideCustomPopup}
                                    className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-40 transition-all"
                                    style={{ fontSize: '14px' }}
                                >
                                    ×
                                </button>

                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    {customPopup.sequenceNumber}
                                </div>

                                <div style={{ padding: '15px' }}></div>
                                
                                <div style={{ padding: '15px' }}>
                                    
                                    <h3 style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#fff',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>
                                        {customPopup.activity.name}
                                    </h3>
                                    
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '6px 10px',
                                        borderRadius: '6px'
                                    }}>
                                        <span style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: '500',
                                            marginRight: '8px'
                                        }}>
                                            {customPopup.activity.type}
                                        </span>
                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                                            🕐 {customPopup.activity.startTime} - {customPopup.activity.endTime}
                                        </span>
                                    </div>
                                    {customPopup.activity.warnings.length > 0 && (
                                        <div style={{
                                            background: 'rgba(255,193,7,0.2)',
                                            border: '1px solid rgba(255,193,7,0.4)',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            margin: '8px 0'
                                        }}>
                                            <span style={{ fontSize: '13px', color: '#fff8dc' }}>
                                                ⚠️ {customPopup.activity.warnings[0].message}
                                            </span>
                                        </div>
                                    )}
                                    {customPopup.activity.notes && (
                                        <div style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            marginTop: '8px',
                                            borderLeft: '3px solid rgba(255,255,255,0.3)'
                                        }}>
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#f0f0f0',
                                                fontStyle: 'italic',
                                                lineHeight: '1.4'
                                            }}>
                                                💭 {customPopup.activity.notes}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}