import env from 'dotenv';
env.config();

import app from './app';
const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
    try {

        app.listen(PORT, () => {
            console.log(`api-gateway running on port ${PORT}`);
        });

    } catch (error) {
        console.error(`Unable to start api-gateway: ${error}`);
        process.exit(1);
    }
};

startServer();