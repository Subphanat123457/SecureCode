import axios from 'axios';

// Create an axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Authenticate user
export const authenticateUser = async (username, password) => {
  try {
    const response = await api.post('login/', {
      username,
      password,
    });
    const { token, role } = response.data;
    // If token is present, return token and role
    if (token) {
      return { token, role };
    } else {
      console.error('No token found in response');
      return null;
    }
  } catch (error) {
    console.error('Error during API call', error);
    return null;
  }
};

// Fetch user data
export const fetchUserData = async (token) => {
  try {
    const response = await api.get('user/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (token, userData) => {
  try {
    const response = await api.put('user/', userData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (username, password, role) => {
  try {
    const response = await api.post('create_user/', {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    console.error('Error during API call', error);
    return null;
  }
};

// Fetch protected data
export const fetchProtectedData = async (token) => {
  try {
    const response = await api.get('protected/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching protected data', error);
    throw error;
  }
};


export const changePassword = async (token, oldPassword, newPassword) => {
  try {
    const response = await api.put('change_password/', {
      old_password: oldPassword,
      new_password: newPassword,
    }, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password', error);
    throw error;
  }
}

export const Logout = async (token) => {
  try {
    const response = await api.post('logout/', {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during API call', error);
    return null;
  }
}
