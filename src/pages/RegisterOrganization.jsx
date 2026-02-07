import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterOrganization = () => {
  const { registerOrg } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "", // Owner Name
    email: "",
    password: "",
    organizationName: "",
    contactNumber: "", // Mobile
    aadharNumber: "",
    gstNumber: "", // Optional
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic Validation
    if (formData.contactNumber.length < 10) {
      setError("Please enter a valid mobile number.");
      setLoading(false);
      return;
    }

    try {
      // We structure the data to match what the backend expects
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "ORGANIZATION", // Hardcoded for this page
        organizationDetails: {
          organizationName: formData.organizationName,
          contactNumber: formData.contactNumber,
          aadharNumber: formData.aadharNumber,
          gstNumber: formData.gstNumber, // Optional
          address: formData.address,
        },
      };

      await registerOrg(payload);
      
      // Redirect to a specific page telling them to wait
      alert("Registration Successful! Please wait for Admin Approval.");
      navigate("/login"); 
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Info */}
        <div className="md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Partner with MovieDay</h2>
          <p className="mb-4">
            List your theaters, manage shows, and reach millions of customers.
          </p>
          <ul className="list-disc list-inside space-y-2 text-indigo-100">
            <li>Real-time booking management</li>
            <li>Analytics Dashboard</li>
            <li>24/7 Support</li>
          </ul>
        </div>


        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8">
          {/* User Type Toggle */}
          <div className="flex bg-gray-700 p-1 rounded-xl mb-6 max-w-sm mx-auto md:mx-0">
            <button
              onClick={() => navigate("/signup")}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-400 hover:text-white"
            >
              User
            </button>
            <button
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-indigo-600 text-white shadow-sm"
            >
              Organization
            </button>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-6">Organization Registration</h3>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Owner Details */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-gray-400 uppercase text-xs tracking-wider mb-2">Owner Details</h4>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Owner Full Name"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Mobile Number"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Official Email"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 col-span-1 md:col-span-2"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 col-span-1 md:col-span-2"
              onChange={handleChange}
              required
            />

            {/* Organization Details */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <h4 className="text-gray-400 uppercase text-xs tracking-wider mb-2">Business Details</h4>
            </div>

            <input
              type="text"
              name="organizationName"
              placeholder="Organization/Theater Name"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 col-span-1 md:col-span-2"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="aadharNumber"
              placeholder="Owner Aadhar Number"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="gstNumber"
              placeholder="GST Number (Optional)"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
            />
            <textarea
              name="address"
              placeholder="Head Office Address"
              className="bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 col-span-1 md:col-span-2 h-24"
              onChange={handleChange}
              required
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="col-span-1 md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition duration-200 mt-4"
            >
              {loading ? "Submitting Request..." : "Submit for Approval"}
            </button>
          </form>
          
          <p className="text-gray-400 mt-4 text-center text-sm">
            Already have an account? <a href="/login" className="text-indigo-400 hover:underline">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrganization;