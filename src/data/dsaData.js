import { 
  Layers, GitBranch, Share2, Search, ArrowDownUp, 
  Cpu, Code2, Hash, Zap, Binary, Activity,
  Maximize, Box
} from 'lucide-react';

export const DSA_CATEGORIES = [
  {
    id: "linear",
    title: "Linear Data Structures",
    desc: "Sequential data management",
    icon: Layers,
    color: "bg-blue-600",
    items: [
      { id: "array", name: "Array Ops", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["INSERT(arr, pos, val):", "  for i from n-1 to pos: arr[i+1] = arr[i]", "  arr[pos] = val"] },
      { id: "stack", name: "Stack", complexity: { time: "O(1)", space: "O(n)" }, pseudo: ["PUSH(val): top++; stack[top] = val", "POP(): val = stack[top]; top--"] },
      { id: "queue", name: "Queue", complexity: { time: "O(1)", space: "O(n)" }, pseudo: ["ENQUEUE(val): rear = (rear+1)%size; q[rear] = val", "DEQUEUE(): front = (front+1)%size"] },
      { id: "linked-list", name: "Singly Linked List", complexity: { time: "O(n)", space: "O(n)" }, pseudo: ["newNode.next = prev.next", "prev.next = newNode"] },
      { id: "doubly-linked-list", name: "Doubly Linked List", complexity: { time: "O(1)", space: "O(n)" }, pseudo: ["node.prev.next = node.next", "node.next.prev = node.prev"] },
      { id: "circular-queue", name: "Circular Queue", complexity: { time: "O(1)", space: "O(n)" }, pseudo: ["rear = (rear + 1) % N", "front = (front + 1) % N"] },
      { id: "deque", name: "Deque", complexity: { time: "O(1)", space: "O(n)" }, pseudo: ["INSERT_FRONT: front = (front - 1 + N) % N", "INSERT_REAR: rear = (rear + 1) % N"] }
    ]
  },
  {
    id: "hashing",
    title: "Hashing & Sets",
    desc: "Key-value mapping",
    icon: Hash,
    color: "bg-indigo-600",
    items: [
      { id: "hash-table", name: "Hash Map", complexity: { time: "O(1) Avg", space: "O(n)" }, pseudo: ["idx = hash(key) % size", "bucket[idx].append({key, val})"] },
      { id: "lru-cache", name: "LRU Cache", complexity: { time: "O(1)", space: "O(capacity)" }, pseudo: ["GET(key): move node to head", "PUT(key): evict tail if full"] },
      { id: "bloom-filter", name: "Bloom Filter", complexity: { time: "O(k)", space: "O(m)" }, pseudo: ["for h in hash_functions: bit_array[h(key)] = 1"] },
      { id: "hash-set", name: "Hash Set", complexity: { time: "O(1)", space: "O(n)" }, pseudo: ["INSERT: if !contains(val): table[hash(val)] = val"] }
    ]
  },
  {
    id: "trees",
    title: "Tree Structures",
    desc: "Hierarchical data",
    icon: GitBranch,
    color: "bg-green-600",
    items: [
      { id: "bst", name: "Binary Search Tree", complexity: { time: "O(log n)", space: "O(n)" }, pseudo: ["if key < node.key: SEARCH(node.left)", "else: SEARCH(node.right)"] },
      { id: "avl-tree", name: "AVL Tree", complexity: { time: "O(log n)", space: "O(n)" }, pseudo: ["if factor > 1: ROTATE_RIGHT(node)", "updateHeight(node)"] },
      { id: "red-black-tree", name: "Red-Black Tree", complexity: { time: "O(log n)", space: "O(n)" }, pseudo: ["recolor nodes", "perform rotations to maintain balance"] },
      { id: "heap", name: "Binary Heap", complexity: { time: "O(log n)", space: "O(n)" }, pseudo: ["HEAPIFY_UP: while val > parent: swap(idx, parent)"] },
      { id: "segment-tree", name: "Segment Tree", complexity: { time: "O(log n)", space: "O(n)" }, pseudo: ["QUERY(l, r): return sum of range"] },
      { id: "trie", name: "Trie (Prefix Tree)", complexity: { time: "O(L)", space: "O(ALPHABET * L * N)" }, pseudo: ["for char in word: node = node.children[char]"] },
      { id: "fenwick-tree", name: "Fenwick Tree (BIT)", complexity: { time: "O(log n)", space: "O(n)" }, pseudo: ["UPDATE: i += i & (-i)", "QUERY: i -= i & (-i)"] },
      { id: "b-tree", name: "B-Tree", complexity: { time: "O(log n)", space: "O(n)" }, pseudo: ["split node if full", "propagate median to parent"] },
      { id: "n-ary-tree", name: "N-ary Tree", complexity: { time: "O(n)", space: "O(n)" }, pseudo: ["for child in node.children: DFS(child)"] }
    ]
  },
  {
    id: "graphs",
    title: "Graph Algorithms",
    desc: "Networks & Pathfinding",
    icon: Share2,
    color: "bg-purple-600",
    items: [
      { id: "dijkstra", name: "Dijkstra's", complexity: { time: "O(E + V log V)", space: "O(V)" }, pseudo: ["while pq: u = pq.pop(); relax_edges(u)"] },
      { id: "bfs", name: "BFS Traversal", complexity: { time: "O(V + E)", space: "O(V)" }, pseudo: ["enqueue(start); visit(neighbors)"] },
      { id: "dfs", name: "DFS Traversal", complexity: { time: "O(V + E)", space: "O(V)" }, pseudo: ["DFS(u): visited[u]=true; for v in adj[u]: DFS(v)"] },
      { id: "bellman-ford", name: "Bellman-Ford", complexity: { time: "O(V * E)", space: "O(V)" }, pseudo: ["repeat V-1: for edge(u,v): relax(u,v)"] },
      { id: "floyd-warshall", name: "Floyd-Warshall", complexity: { time: "O(V³)", space: "O(V²)" }, pseudo: ["for k, i, j: dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])"] },
      { id: "kruskal", name: "Kruskal's MST", complexity: { time: "O(E log E)", space: "O(V)" }, pseudo: ["sort edges; union-find to prevent cycles"] },
      { id: "prim", name: "Prim's MST", complexity: { time: "O(E log V)", space: "O(V)" }, pseudo: ["pq.push(nodes); add min edge to MST"] },
      { id: "topo-sort", name: "Topological Sort", complexity: { time: "O(V + E)", space: "O(V)" }, pseudo: ["Kahn's: if indegree == 0: push to queue"] },
      { id: "tarjan", name: "Tarjan's (SCC)", complexity: { time: "O(V + E)", space: "O(V)" }, pseudo: ["find strongly connected components using DFS stack"] },
      { id: "a-star", name: "A* Search", complexity: { time: "O(E)", space: "O(V)" }, pseudo: ["f(n) = g(n) + h(n)", "pq.push(start)"] }
    ]
  },
  {
    id: "sorting",
    title: "Sorting",
    desc: "Ordering data",
    icon: ArrowDownUp,
    color: "bg-orange-600",
    items: [
      { id: "bubble-sort", name: "Bubble Sort", complexity: { time: "O(n²)", space: "O(1)" }, pseudo: ["if a > b: swap(a, b)"] },
      { id: "insertion-sort", name: "Insertion Sort", complexity: { time: "O(n²)", space: "O(1)" }, pseudo: ["place key in its correct sorted position"] },
      { id: "selection-sort", name: "Selection Sort", complexity: { time: "O(n²)", space: "O(1)" }, pseudo: ["find min in unsorted part; swap with first"] },
      { id: "quick-sort", name: "Quick Sort", complexity: { time: "O(n log n)", space: "O(log n)" }, pseudo: ["pivot = partition(arr); sort(left); sort(right)"] },
      { id: "merge-sort", name: "Merge Sort", complexity: { time: "O(n log n)", space: "O(n)" }, pseudo: ["divide until size 1; merge sorted halves"] },
      { id: "heap-sort", name: "Heap Sort", complexity: { time: "O(n log n)", space: "O(1)" }, pseudo: ["buildMaxHeap; extract max and heapify"] },
      { id: "radix-sort", name: "Radix Sort", complexity: { time: "O(nk)", space: "O(n+k)" }, pseudo: ["sort by each digit position using counting sort"] },
      { id: "counting-sort", name: "Counting Sort", complexity: { time: "O(n+k)", space: "O(k)" }, pseudo: ["count occurrences of each value", "prefix sum to find positions"] },
      { id: "shell-sort", name: "Shell Sort", complexity: { time: "O(n log n)", space: "O(1)" }, pseudo: ["insertion sort with decreasing gap sizes"] }
    ]
  },
  {
    id: "searching",
    title: "Searching",
    desc: "Retrieval patterns",
    icon: Search,
    color: "bg-teal-600",
    items: [
      { id: "linear-search", name: "Linear Search", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["for item in list: if item == target return"] },
      { id: "binary-search", name: "Binary Search", complexity: { time: "O(log n)", space: "O(1)" }, pseudo: ["check mid; update low or high"] },
      { id: "ternary-search", name: "Ternary Search", complexity: { time: "O(log3 n)", space: "O(1)" }, pseudo: ["split range into 3; check mid1 and mid2"] },
      { id: "exponential-search", name: "Exponential Search", complexity: { time: "O(log n)", space: "O(1)" }, pseudo: ["find range by doubling index; binary search in range"] },
      { id: "jump-search", name: "Jump Search", complexity: { time: "O(√n)", space: "O(1)" }, pseudo: ["jump in blocks of √n", "linear search within block"] }
    ]
  },
  {
    id: "techniques",
    title: "Dynamic Programming",
    desc: "Optimal substructures",
    icon: Cpu,
    color: "bg-pink-600",
    items: [
      { id: "knapsack", name: "0/1 Knapsack", complexity: { time: "O(NW)", space: "O(NW)" }, pseudo: ["dp[i][w] = max(val + dp[i-1][w-wt], dp[i-1][w])"] },
      { id: "lcs", name: "Longest Common Subsequence", complexity: { time: "O(MN)", space: "O(MN)" }, pseudo: ["if match: 1+dp; else: max(up, left)"] },
      { id: "lis", name: "Longest Increasing Subsequence", complexity: { time: "O(n log n)", space: "O(n)" }, pseudo: ["for i: for j < i: if arr[i] > arr[j]: dp[i] = max"] },
      { id: "edit-distance", name: "Edit Distance", complexity: { time: "O(MN)", space: "O(MN)" }, pseudo: ["dp[i][j] = min(insert, delete, replace)"] },
      { id: "mcm", name: "Matrix Chain Multiplication", complexity: { time: "O(n³)", space: "O(n²)" }, pseudo: ["find min cost to multiply chain of matrices"] },
      { id: "kadane", name: "Kadane's Algorithm", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["max_ending_here = max(x, max_ending_here + x)"] }
    ]
  },
  {
    id: "backtracking",
    title: "Backtracking",
    desc: "Exhaustive search",
    icon: Maximize,
    color: "bg-rose-600",
    items: [
      { id: "n-queens", name: "N-Queens", complexity: { time: "O(N!)", space: "O(N)" }, pseudo: ["if safe: place; solve next; backtrack"] },
      { id: "sudoku-solver", name: "Sudoku Solver", complexity: { time: "O(9^(n*n))", space: "O(n*n)" }, pseudo: ["try digits 1-9; if valid recurse; else reset"] },
      { id: "permutation", name: "Permutations", complexity: { time: "O(N * N!)", space: "O(N)" }, pseudo: ["swap current with each element; recurse; swap back"] },
      { id: "subset-sum", name: "Subset Sum", complexity: { time: "O(2^n)", space: "O(n)" }, pseudo: ["include element; recurse; exclude; recurse"] }
    ]
  },
  {
    id: "divide-conquer",
    title: "Divide & Conquer",
    desc: "Recursive breaking",
    icon: Box,
    color: "bg-cyan-600",
    items: [
      { id: "binary-exponentiation", name: "Binary Exponentiation", complexity: { time: "O(log n)", space: "O(log n)" }, pseudo: ["if n is even: (a^(n/2))²", "else: a * (a^(n-1))"] },
      { id: "strassens", name: "Strassen's Matrix Mult", complexity: { time: "O(n^2.81)", space: "O(n²)" }, pseudo: ["divide matrices into 4 sub-matrices", "use 7 multiplications instead of 8"] }
    ]
  },
  {
    id: "patterns",
    title: "Algo Patterns",
    desc: "Modern logic strategies",
    icon: Activity,
    color: "bg-amber-600",
    items: [
      { id: "sliding-window", name: "Sliding Window", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["while sum > k: sum -= arr[left]; left++"] },
      { id: "two-pointers", name: "Two Pointers", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["while L < R: check sum; move pointers"] },
      { id: "fast-slow-pointers", name: "Fast & Slow Pointers", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["slow = slow.next", "fast = fast.next.next", "if slow == fast: cycle"] }
    ]
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    desc: "Low-level operations",
    icon: Binary,
    color: "bg-gray-700",
    items: [
      { id: "single-number", name: "Find Single Number", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["result ^= num; // XOR all elements"] },
      { id: "counting-bits", name: "Counting Bits", complexity: { time: "O(n)", space: "O(1)" }, pseudo: ["count = n & (n-1); // Remove set bits"] },
      { id: "power-of-two", name: "Is Power of Two", complexity: { time: "O(1)", space: "O(1)" }, pseudo: ["return n > 0 && (n & (n - 1)) == 0"] }
    ]
  },
  {
    id: "strings",
    title: "String Algos",
    desc: "Pattern matching",
    icon: Code2,
    color: "bg-red-600",
    items: [
      { id: "kmp", name: "KMP Search", complexity: { time: "O(n+m)", space: "O(m)" }, pseudo: ["use LPS array to skip comparisons"] },
      { id: "rabin-karp", name: "Rabin-Karp", complexity: { time: "O(n+m)", space: "O(1)" }, pseudo: ["compare hashes using rolling hash"] },
      { id: "z-algorithm", name: "Z-Algorithm", complexity: { time: "O(n+m)", space: "O(n+m)" }, pseudo: ["build Z-array for linear pattern matching"] },
      { id: "manachers", name: "Manacher's Algorithm", complexity: { time: "O(n)", space: "O(n)" }, pseudo: ["find longest palindromic substring in linear time"] }
    ]
  }
];