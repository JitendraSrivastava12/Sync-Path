// This file exports a mapping from algorithm/data-structure id to the
// corresponding generated visualizer component. It's used by
// AlgorithmVisualizer to directly render the correct stub.

import AStarVisualizer from './visualizers/generated/AStarVisualizer.jsx';
import ArrayVisualizer from './visualizers/generated/ArrayVisualizer.jsx';
import AvlTreeVisualizer from './visualizers/generated/AvlTreeVisualizer.jsx';
import BTreeVisualizer from './visualizers/generated/BTreeVisualizer.jsx';
import BellmanFordVisualizer from './visualizers/generated/BellmanFordVisualizer.jsx';
import BfsVisualizer from './visualizers/generated/BfsVisualizer.jsx';
import BinaryExponentiationVisualizer from './visualizers/generated/BinaryExponentiationVisualizer.jsx';
import BinarySearchVisualizer from './visualizers/generated/BinarySearchVisualizer.jsx';
import BloomFilterVisualizer from './visualizers/generated/BloomFilterVisualizer.jsx';
import BstVisualizer from './visualizers/generated/BstVisualizer.jsx';
import BubbleSortVisualizer from './visualizers/generated/BubbleSortVisualizer.jsx';
import CircularQueueVisualizer from './visualizers/generated/CircularQueueVisualizer.jsx';
import CountingBitsVisualizer from './visualizers/generated/CountingBitsVisualizer.jsx';
import CountingSortVisualizer from './visualizers/generated/CountingSortVisualizer.jsx';
import DequeVisualizer from './visualizers/generated/DequeVisualizer.jsx';
import DfsVisualizer from './visualizers/generated/DfsVisualizer.jsx';
import DijkstraVisualizer from './visualizers/generated/DijkstraVisualizer.jsx';
import DoublyLinkedListVisualizer from './visualizers/generated/DoublyLinkedListVisualizer.jsx';
import EditDistanceVisualizer from './visualizers/generated/EditDistanceVisualizer.jsx';
import ExponentialSearchVisualizer from './visualizers/generated/ExponentialSearchVisualizer.jsx';
import FastSlowPointersVisualizer from './visualizers/generated/FastSlowPointersVisualizer.jsx';
import FenwickTreeVisualizer from './visualizers/generated/FenwickTreeVisualizer.jsx';
import FloydWarshallVisualizer from './visualizers/generated/FloydWarshallVisualizer.jsx';
import HashSetVisualizer from './visualizers/generated/HashSetVisualizer.jsx';
import HashTableVisualizer from './visualizers/generated/HashTableVisualizer.jsx';
import HeapVisualizer from './visualizers/generated/HeapVisualizer.jsx';
import HeapSortVisualizer from './visualizers/generated/HeapSortVisualizer.jsx';
import InsertionSortVisualizer from './visualizers/generated/InsertionSortVisualizer.jsx';
import JumpSearchVisualizer from './visualizers/generated/JumpSearchVisualizer.jsx';
import KadaneVisualizer from './visualizers/generated/KadaneVisualizer.jsx';
import KmpVisualizer from './visualizers/generated/KmpVisualizer.jsx';
import KnapsackVisualizer from './visualizers/generated/KnapsackVisualizer.jsx';
import KruskalVisualizer from './visualizers/generated/KruskalVisualizer.jsx';
import LcsVisualizer from './visualizers/generated/LcsVisualizer.jsx';
import LinearSearchVisualizer from './visualizers/generated/LinearSearchVisualizer.jsx';
import LinkedListVisualizer from './visualizers/generated/LinkedListVisualizer.jsx';
import LisVisualizer from './visualizers/generated/LisVisualizer.jsx';
import LruCacheVisualizer from './visualizers/generated/LruCacheVisualizer.jsx';
import ManachersVisualizer from './visualizers/generated/ManachersVisualizer.jsx';
import McmVisualizer from './visualizers/generated/McmVisualizer.jsx';
import MergeSortVisualizer from './visualizers/generated/MergeSortVisualizer.jsx';
import NAryTreeVisualizer from './visualizers/generated/NAryTreeVisualizer.jsx';
import NQueensVisualizer from './visualizers/generated/NQueensVisualizer.jsx';
import PermutationVisualizer from './visualizers/generated/PermutationVisualizer.jsx';
import PowerOfTwoVisualizer from './visualizers/generated/PowerOfTwoVisualizer.jsx';
import PrimVisualizer from './visualizers/generated/PrimVisualizer.jsx';
import QueueVisualizer from './visualizers/generated/QueueVisualizer.jsx';
import QuickSortVisualizer from './visualizers/generated/QuickSortVisualizer.jsx';
import RabinKarpVisualizer from './visualizers/generated/RabinKarpVisualizer.jsx';
import RadixSortVisualizer from './visualizers/generated/RadixSortVisualizer.jsx';
import RedBlackTreeVisualizer from './visualizers/generated/RedBlackTreeVisualizer.jsx';
import SegmentTreeVisualizer from './visualizers/generated/SegmentTreeVisualizer.jsx';
import SelectionSortVisualizer from './visualizers/generated/SelectionSortVisualizer.jsx';
import ShellSortVisualizer from './visualizers/generated/ShellSortVisualizer.jsx';
import SingleNumberVisualizer from './visualizers/generated/SingleNumberVisualizer.jsx';
import SlidingWindowVisualizer from './visualizers/generated/SlidingWindowVisualizer.jsx';
import StackVisualizer from './visualizers/generated/StackVisualizer.jsx';
import StrassensVisualizer from './visualizers/generated/StrassensVisualizer.jsx';
import SubsetSumVisualizer from './visualizers/generated/SubsetSumVisualizer.jsx';
import SudokuSolverVisualizer from './visualizers/generated/SudokuSolverVisualizer.jsx';
import TarjanVisualizer from './visualizers/generated/TarjanVisualizer.jsx';
import TernarySearchVisualizer from './visualizers/generated/TernarySearchVisualizer.jsx';
import TopoSortVisualizer from './visualizers/generated/TopoSortVisualizer.jsx';
import TrieVisualizer from './visualizers/generated/TrieVisualizer.jsx';
import TwoPointersVisualizer from './visualizers/generated/TwoPointersVisualizer.jsx';
import ZAlgorithmVisualizer from './visualizers/generated/ZAlgorithmVisualizer.jsx';

const map = {
  'a-star': AStarVisualizer,
  'array': ArrayVisualizer,
  'avl-tree': AvlTreeVisualizer,
  'b-tree': BTreeVisualizer,
  'bellman-ford': BellmanFordVisualizer,
  'bfs': BfsVisualizer,
  'binary-exponentiation': BinaryExponentiationVisualizer,
  'binary-search': BinarySearchVisualizer,
  'bloom-filter': BloomFilterVisualizer,
  'bst': BstVisualizer,
  'bubble-sort': BubbleSortVisualizer,
  'circular-queue': CircularQueueVisualizer,
  'counting-bits': CountingBitsVisualizer,
  'counting-sort': CountingSortVisualizer,
  'deque': DequeVisualizer,
  'dfs': DfsVisualizer,
  'dijkstra': DijkstraVisualizer,
  'doubly-linked-list': DoublyLinkedListVisualizer,
  'edit-distance': EditDistanceVisualizer,
  'exponential-search': ExponentialSearchVisualizer,
  'fast-slow-pointers': FastSlowPointersVisualizer,
  'fenwick-tree': FenwickTreeVisualizer,
  'floyd-warshall': FloydWarshallVisualizer,
  'hash-set': HashSetVisualizer,
  'hash-table': HashTableVisualizer,
  'heap': HeapVisualizer,
  'heap-sort': HeapSortVisualizer,
  'insertion-sort': InsertionSortVisualizer,
  'jump-search': JumpSearchVisualizer,
  'kadane': KadaneVisualizer,
  'kmp': KmpVisualizer,
  'knapsack': KnapsackVisualizer,
  'kruskal': KruskalVisualizer,
  'lcs': LcsVisualizer,
  'linear-search': LinearSearchVisualizer,
  'linked-list': LinkedListVisualizer,
  'lis': LisVisualizer,
  'lru-cache': LruCacheVisualizer,
  'manachers': ManachersVisualizer,
  'mcm': McmVisualizer,
  'merge-sort': MergeSortVisualizer,
  'n-ary-tree': NAryTreeVisualizer,
  'n-queens': NQueensVisualizer,
  'permutation': PermutationVisualizer,
  'power-of-two': PowerOfTwoVisualizer,
  'prim': PrimVisualizer,
  'queue': QueueVisualizer,
  'quick-sort': QuickSortVisualizer,
  'rabin-karp': RabinKarpVisualizer,
  'radix-sort': RadixSortVisualizer,
  'red-black-tree': RedBlackTreeVisualizer,
  'segment-tree': SegmentTreeVisualizer,
  'selection-sort': SelectionSortVisualizer,
  'shell-sort': ShellSortVisualizer,
  'single-number': SingleNumberVisualizer,
  'sliding-window': SlidingWindowVisualizer,
  'stack': StackVisualizer,
  'strassens': StrassensVisualizer,
  'subset-sum': SubsetSumVisualizer,
  'sudoku-solver': SudokuSolverVisualizer,
  'tarjan': TarjanVisualizer,
  'ternary-search': TernarySearchVisualizer,
  'topo-sort': TopoSortVisualizer,
  'trie': TrieVisualizer,
  'two-pointers': TwoPointersVisualizer,
  'z-algorithm': ZAlgorithmVisualizer,
};

export default map;
