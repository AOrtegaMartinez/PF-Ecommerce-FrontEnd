import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchProfile } from "../../redux/actions/userAction";

const Billing = () => {
  const userOrders = useSelector(state => state.user.profile.user.orders);
  
  useEffect(() => {
    fetchProfile();
  }, [userOrders]);

  return (
    <div className="">
      <div className="bg-white shadow-md mt-12 max-w-6xl mx-auto">
        <div className="bg-zinc-50 text-lg font-inter font-semibold p-4">
          Billing History
        </div>
        <div className="p-4 bg-zinc-200">
          {userOrders && userOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="w-full">
                <div className="mb-4 flex items-center justify-between border-b border-gray-500">
                  <div className="w-1/4 px-4 py-2 font-inter font-semibold">
                    Transaction ID
                  </div>
                  <div className="w-1/4 px-4 py-2 font-inter font-semibold">
                    Date
                  </div>
                  <div className="w-1/4 px-4 py-2 font-inter font-semibold">
                    Amount
                  </div>
                  <div className="w-1/4 px-4 py-2 font-inter font-semibold">
                    Status
                  </div>
                </div>
                {userOrders.map(order => (
                  <div key={order.id} className="mb-4 flex items-center justify-between border-b border-gray-200">
                    <div className="w-1/4 px-4 py-2">#{order.id}</div>
                    <div className="w-1/4 px-4 py-2">{new Date(order.updatedAt).toLocaleDateString()}</div>
                    <div className="w-1/4 px-4 py-2">${order.total_amount}</div>
                    <div className="w-1/4 px-4 py-2">
                      <span className={`px-2 py-1 rounded ${order.status === "completed" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Aún no hay plantillas compradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
