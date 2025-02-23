// Previous imports remain the same...

interface CardData {
  name: string;
  wishes: string[];
  location: string;
}

interface Message {
  source: 'ai' | 'user';
  message: string;
  type?: 'name' | 'wish' | 'location';
}

// Update the ChristmasCard component to better handle dynamic updates
const ChristmasCard: React.FC<CardData> = ({ name, wishes, location }) => {
  return (
    <motion.div
      className="w-96 bg-white rounded-lg shadow-xl p-6 transform rotate-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-4 border-red-600 p-4 rounded-lg">
        <h2 className="text-2xl font-festive text-red-600 text-center mb-4">
          My Letter to Santa
        </h2>
        
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-festive text-lg">Dear Santa,</p>
            <p className="font-festive text-lg">
              My name is <span className="font-bold">{name || '_______'}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="font-festive text-lg">This Christmas, I wish for:</p>
            <ul className="list-disc pl-6 font-festive">
              {wishes && wishes.length > 0 ? (
                wishes.map((wish, index) => (
                  <motion.li
                    key={index}
                    className="text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                  >
                    {wish}
                  </motion.li>
                ))
              ) : (
                <li className="text-lg">_______</li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {location ? (
              <p className="font-festive text-lg">
                I'll be celebrating in <span className="font-bold">{location}</span>!
              </p>
            ) : (
              <p className="font-festive text-lg">I'll be celebrating in _______!</p>
            )}
          </motion.div>

          <motion.p
            className="font-festive text-lg text-right mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Thank you, Santa!
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

// Rest of the component remains the same...
