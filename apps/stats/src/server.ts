import env from 'dotenv';
env.config();

import app from './app';
const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
    try {

        app.listen(PORT, () => {
            console.log(`stats-service running on port ${PORT}`);
        });

    } catch (error) {
        console.error(`Unable to start stats-service: ${error}`);
        process.exit(1);
    }
};

startServer();