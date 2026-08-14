from pydantic import BaseModel, ConfigDict


class ForbidExtraModel(BaseModel):
    model_config = ConfigDict(extra="forbid")
