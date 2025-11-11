import re

def find(x, parent):
    if parent[x] != x:
        parent[x] = find(parent[x], parent)
    return parent[x]

def union(x, y, parent, rank):
    root_x = find(x, parent=parent)
    root_y = find(y, parent=parent)
    if root_x != root_y:
        if rank[root_x] < rank[root_y]:
            root_x, root_y = root_y, root_x
        parent[root_y] = root_x
        if rank[root_x] == rank[root_y]:
            rank[root_x] += 1
            
def build_subject_groups(subject_rows):
    """
        subject_rows: list of (SubjectCode, ReplacedBy) from Subjects table
        return:
            1) parent, rank -> DSU
            2) group_id_of_subject: dict {subject_code -> root_code}
            3) subject_list: list of subject code
    """
    subject_set = set()
    edges = []
    
    parent = {}
    rank = {}
    
    for row in subject_rows:
        subject_code = row[0]
        replaced_by_str = row[1] if len(row) > 1 else ''
        subject_set.add(subject_code)
        
        if replaced_by_str:
            splitted = re.split(r'[,\+]+', replaced_by_str)
            splitted = [s.strip() for s in splitted if s.strip()]
            for r_code in splitted:
                subject_set.add(r_code)
                edges.append((subject_code, r_code))
                
    for subj in subject_set:
        parent[subj] = subj
        rank[subj] = 0
                
    for s1, s2 in edges:
        union(s1, s2, parent = parent, rank = rank)
        
    group_id_of_subject = {}
    for subj in subject_set:
        root = find(subj, parent)
        group_id_of_subject[subj] = root
        
    return parent, rank, group_id_of_subject, list(subject_set)