from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
import re

app = FastAPI(title="AgriPulseX Backend", version="1.0.0")
