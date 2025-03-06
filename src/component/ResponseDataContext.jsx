import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

export const ResponseDataContext = createContext();

export const ResponseDataProvider = ({ children }) => {
  const [responseData, setResponseData] = useState(() => {
    const data = Cookies.get('responseData');
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    if (responseData !== null) {
      Cookies.set('responseData', JSON.stringify(responseData), { expires: 7 });
    } else {
      Cookies.remove('responseData');
    }
  }, [responseData]);

  return (
    <ResponseDataContext.Provider value={{ responseData, setResponseData }}>
      {children}
    </ResponseDataContext.Provider>
  );
};


/**
 * 
 * @returns {{
 *    responseData: {
 *       status: Number
 *       data: {
 *        'userName': String,
 *        'userRole': String,
 *        'businessId': Number,
 *        'role': String,
 *        'department': String,
 *        'access': [String],
 *        'name': String,
 *        'nickname': String,
 *        'imageUrl': String
 *      },
 *      'token': String
 *   }
 * }}
 */
export const useResponseData = () => useContext(ResponseDataContext);

