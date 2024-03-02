from enum import Enum
class Role(str, Enum):
    member = 'member'
    premiumMember = 'premiumMember'
    admin = 'admin'