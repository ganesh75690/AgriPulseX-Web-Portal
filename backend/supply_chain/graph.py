import networkx as nx

def build_graph():
    G = nx.Graph()
    G.add_edges_from([
        ("Farm A", "Mandi Amritsar"),
        ("Farm B", "Mandi Jalandhar"),
        ("Mandi Amritsar", "Central Hub"),
        ("Mandi Jalandhar", "Central Hub"),
    ])
    return G