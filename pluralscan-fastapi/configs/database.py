from pluralscan.data.inmemory.memory_context import MemoryContext
from pluralscan.libs.ddd.event_dispatcher import MemoryEventDispatcher

EVENT_SOURCING = MemoryEventDispatcher()
MEMORY_CONTEXT = MemoryContext()
