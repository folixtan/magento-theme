"""
Folix Game Theme - Magento Theme Development Assistant

This agent helps users develop, deploy, and customize the Folix Game Theme
for Magento 2.4.8-p4. It provides guidance on theme structure, styling rules,
and best practices.

Features:
- Theme structure analysis
- CSS/Less compilation guidance
- Layout modification recommendations
- Component styling assistance
"""

import os
import json
from typing import Annotated
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langgraph.graph import MessagesState
from langgraph.graph.message import add_messages
from langchain_core.messages import AnyMessage
from coze_coding_utils.runtime_ctx.context import default_headers
from storage.memory.memory_saver import get_memory_saver

# Configuration
LLM_CONFIG = "config/agent_llm_config.json"
MAX_MESSAGES = 40  # Retain last 20 rounds (40 messages)

def _windowed_messages(old, new):
    """Sliding window: keep only the most recent MAX_MESSAGES"""
    return add_messages(old, new)[-MAX_MESSAGES:]  # type: ignore

class AgentState(MessagesState):
    messages: Annotated[list[AnyMessage], _windowed_messages]

def build_agent(ctx=None):
    """Build the Folix Theme Development Agent"""
    workspace_path = os.getenv("COZE_WORKSPACE_PATH", "/workspace/projects")
    config_path = os.path.join(workspace_path, LLM_CONFIG)
    
    # Load configuration
    with open(config_path, 'r', encoding='utf-8') as f:
        cfg = json.load(f)
    
    # Initialize LLM
    api_key = os.getenv("COZE_WORKLOAD_IDENTITY_API_KEY")
    base_url = os.getenv("COZE_INTEGRATION_MODEL_BASE_URL")
    
    llm = ChatOpenAI(
        model=cfg['config'].get("model"),
        api_key=api_key,
        base_url=base_url,
        temperature=cfg['config'].get('temperature', 0.7),
        streaming=True,
        timeout=cfg['config'].get('timeout', 600),
        extra_body={
            "thinking": {
                "type": cfg['config'].get('thinking', 'disabled')
            }
        },
        default_headers=default_headers(ctx) if ctx else {}
    )
    
    return create_agent(
        model=llm,
        system_prompt=cfg.get("sp"),
        tools=[],
        checkpointer=get_memory_saver(),
        state_schema=AgentState,
    )
