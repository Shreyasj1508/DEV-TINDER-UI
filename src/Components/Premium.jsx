import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
    try {
      setIsLoading(true);
      setSelectedPlan(type);
      
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
        name: "Dev Tinder Premium",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} Membership - Connect with top developers`,
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: type === 'gold' ? "#F59E0B" : "#6B7280",
        },
        handler: async function(response) {
          await verifyPremiumUser();
          setIsLoading(false);
          setSelectedPlan(null);
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            setSelectedPlan(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };
  return isUserPremium ? (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
        <div className="text-8xl mb-6 animate-bounce">👑</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Premium Member
        </h1>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 inline-block shadow-lg">
          ✨ All Features Unlocked
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          You're enjoying unlimited connections and all premium features! 
          <br />
          <span className="text-purple-600 font-semibold">Keep networking like a pro! 🚀</span>
        </p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/2 right-10 w-32 h-32 bg-pink-300/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-300/30 rounded-full blur-xl animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6 animate-bounce">🚀</div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Unlock unlimited connections, advanced features, and exclusive badges to supercharge your developer networking journey
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all">
              💡 No Hidden Fees
            </div>
            <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all">
              🔒 Secure Payment
            </div>
            <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all">
              ⚡ Instant Activation
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* Silver Plan */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-white/20 group">
            <div className="bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              <div className="text-5xl mb-4 relative z-10">🥈</div>
              <h2 className="text-3xl font-bold mb-2 relative z-10">Silver</h2>
              <p className="text-gray-200 text-lg relative z-10">Perfect for beginners</p>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-10">
                STARTER
              </div>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-800 mb-2">₹599</div>
                <div className="text-gray-600 text-lg">for 3 months</div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block mt-2">
                  ₹200/month
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Chat with other developers</span>
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700"><strong>25</strong> connection requests/day</span>
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Silver verification badge 🥈</span>
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              
              <button
                onClick={() => handleBuyClick("silver")}
                disabled={isLoading && selectedPlan === "silver"}
                className={`w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading && selectedPlan === "silver" ? "animate-pulse" : ""
                }`}
              >
                {isLoading && selectedPlan === "silver" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Choose Silver 🥈"
                )}
              </button>
            </div>
          </div>

          {/* Gold Plan */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl relative border border-white/20 group">
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                🔥 MOST POPULAR
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              <div className="text-5xl mb-4 relative z-10">👑</div>
              <h2 className="text-3xl font-bold mb-2 relative z-10">Gold</h2>
              <p className="text-yellow-100 text-lg relative z-10">For serious networkers</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-800 mb-2">₹1299</div>
                <div className="text-gray-600 text-lg">for 6 months</div>
                <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block mt-2 font-semibold">
                  ₹217/month • Save 35%
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Everything in Silver +</span>
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700"><strong className="text-yellow-600">Unlimited</strong> connection requests</span>
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Golden crown badge 👑</span>
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Advanced filters & search</span>
                </li>
              </ul>
              
              <button
                onClick={() => handleBuyClick("gold")}
                disabled={isLoading && selectedPlan === "gold"}
                className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading && selectedPlan === "gold" ? "animate-pulse" : ""
                }`}
              >
                {isLoading && selectedPlan === "gold" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Choose Gold 👑"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="text-center mt-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl border border-white/20">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Premium?</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4 animate-bounce">🎯</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Smart Matching</h4>
                <p className="text-gray-600">AI-powered algorithm finds your perfect coding partners based on skills and interests</p>
              </div>
              <div className="transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.2s'}}>⚡</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Instant Connections</h4>
                <p className="text-gray-600">No waiting limits, connect with unlimited developers and expand your network</p>
              </div>
              <div className="transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.4s'}}>🏆</div>
                <h4 className="font-bold text-xl text-gray-800 mb-2">Exclusive Features</h4>
                <p className="text-gray-600">Premium badges, advanced filters, priority support, and early access to new features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl text-white">
            <div className="text-5xl mb-4">💬</div>
            <blockquote className="text-xl italic mb-4">
              "Premium membership transformed my networking game! I've connected with amazing developers and landed my dream job."
            </blockquote>
            <p className="font-semibold">- Sarah, Full Stack Developer</p>
            <div className="flex justify-center mt-4">
              <span className="text-yellow-300">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Premium;