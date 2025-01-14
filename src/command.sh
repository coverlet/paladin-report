#!/bin/bash
#test
#tail -f test/output.log | grep -E "num_sanitized_ok.*id=2000|id=2000.*num_sanitized_ok"

journalctl -ocat -u solana | grep -E "num_sanitized_ok.*id=2000|id=2000.*num_sanitized_ok"