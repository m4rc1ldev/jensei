import { useState, useEffect } from 'react';
import { API_URL } from '../../../../config/api.js';

/**
 * Custom hook to fetch and manage doctor profile data.
 */
const useDoctorData = (id) => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) {
        setError('Doctor ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/doctors/${id}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch doctor');
        }

        if (data.success && data.data) {
          const mappedData = {
            id: data.data._id || data.data.id,
            name: data.data.name || '',
            specialty: data.data.specialty || '',
            rating: data.data.rating || 0,
            badge: data.data.badge || null,
            fee: data.data.fee || 0,
            price: `\u20B9${data.data.fee || 0}`,
            priceType: 'Video',
            image: data.data.image,
            biography: data.data.biography || '',
            specializedIssues: data.data.specialization || [],
            license: data.data.qualifications || '',
            experience: data.data.experience || 0,
            totalConsultations: data.data.totalConsultations || 0,
            office: {
              location: `\uD83D\uDCCD ${data.data.location || ''}`,
              address: data.data.officeAddress || '',
              hours: '10:30-11:00 AM',
              phone: data.data.officePhoneNumber || data.data.phoneNumber || '',
              mapImage: '/doctors-listing/c3ed3d621b062ce27e7e4595d21516110cce967b.png',
              distance: '2.7km'
            },
            timeSlots: [],
            timePeriods: [
              { label: 'Morning', count: 0, active: false },
              { label: 'Afternoon', count: 0, active: false },
              { label: 'Evening', count: 0, active: false },
              { label: 'Night', count: 0, active: false }
            ],
            slots: {
              Morning: [],
              Afternoon: [],
              Evening: [],
              Night: []
            }
          };
          setDoctorData(mappedData);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError(err.message || 'Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  return { doctorData, setDoctorData, loading, error };
};

export default useDoctorData;
