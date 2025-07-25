import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Tinder",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return isUserPremium ? (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-100 flex items-center justify-center">
      <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md">
        <div className="text-8xl mb-6">👑</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
          Premium Member
        </h1>
        <p className="text-gray-600 text-lg">You're already enjoying all premium features!</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Go Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited connections and premium features to supercharge your developer networking
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Silver Membership */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-6 text-white text-center">
              <div className="text-4xl mb-2">🥈</div>
              <h2 className="text-3xl font-bold mb-2">Silver</h2>
              <p className="text-gray-200">Perfect for getting started</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800 mb-2">₹499</div>
                <div className="text-gray-600">for 3 months</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Chat with other developers
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  100 connection requests per day
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified blue badge
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
              </ul>
              
              <button
                onClick={() => handleBuyClick("silver")}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Choose Silver
              </button>
            </div>
          </div>

          {/* Gold Membership */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 relative">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              POPULAR
            </div>
            
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-white text-center">
              <div className="text-4xl mb-2">👑</div>
              <h2 className="text-3xl font-bold mb-2">Gold</h2>
              <p className="text-yellow-100">For serious networkers</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800 mb-2">₹899</div>
                <div className="text-gray-600">for 6 months</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Silver
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-yellow-600">Unlimited</span> connection requests
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Golden crown badge
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced filters
                </li>
              </ul>
              
              <button
                onClick={() => handleBuyClick("gold")}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Choose Gold ⭐
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Premium;
