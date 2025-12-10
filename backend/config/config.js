/*
 * Copyright (c) 2025 Choice Properties
 * Licensed under the MIT License
 */

import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

export const config = {
    port: process.env.PORT || 8000,
};


