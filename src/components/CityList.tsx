import React, { useEffect, useState } from 'react';

const dataUrl = './bike-route/data/route_cities.geojson';

interface CityProperties {
  Cityname: string;
}

interface CityFeature {
  properties: CityProperties;
}

interface CityData {
  features: CityFeature[];
}

const CityGrid: React.FC = () => {
  const [data, setData] = useState<CityData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        const result: CityData = await response.json();
        console.log(result); // Log the data to inspect its structure
        setData(result);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <h2  className='mb-4 text-xl font-bold'>The course of the trail:</h2>
      {data && data.features ? (
        <div className="city-grid">
          {data.features.map((city) => (
            <div className="city-item" key={city.properties.Cityname}>
              <div
                className="city-tile link-button"
                id={city.properties.Cityname}
                aria-label={`View details for ${city.properties.Cityname}`}
              >
                {city.properties.Cityname}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading or data not available.</p>
      )}

      <style>{`
        .city-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }

        .city-tile {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
          font-size: 1rem;
          font-weight: bold;
        }

        .city-tile:hover {
          background-color: #e0f7fa;
          border-color: #00796b;
        }
      `}</style>
    </>
  );
};

export default CityGrid;
