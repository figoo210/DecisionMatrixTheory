import numpy as np
import pandas as pd


def index_2d(two_d_array, v):
    for i, x in enumerate(two_d_array):
        if v in x:
            return i, x.index(v)


def maximax(matrix):
    max_value = 0
    for row in matrix:
        for j in row:
            if j > max_value:
                max_value = j
    return max_value, index_2d(matrix, max_value)


def maximin(matrix):
    maxmini_value = []
    for row in matrix:
        maxmini_value.append(min(row))
    maxmini_last_value = max(maxmini_value)
    return maxmini_last_value, index_2d(matrix, maxmini_last_value)


def criterion_of_realism(matrix, alpha):
    # creating alpha,matrix...alpha_bgd
    matri = np.array(matrix)
    # Multiple Max num * alpha from each row & min num *1-alpha
    total_alpha = (np.multiply(matri.max(axis=1), alpha) + np.multiply(matri.min(axis=1), (1 - alpha)))
    # get the max num from the Alpha Equation
    max_value = total_alpha.max()
    return max_value, np.where(total_alpha == max_value)[0].tolist()[0]


def equally_likely(matrix):
    matrix_value = np.array(matrix)
    total_avg_list = matrix_value.mean(axis=1)
    total_avg = total_avg_list.max()
    return total_avg, np.where(total_avg_list == total_avg)[0].tolist()[0]


def decision_matrix_calc(matrix, weights):
    matrix_value = np.array(matrix)
    # create empty weight
    weight = np.array(weights)
    # multiple weight*table
    new_table = matrix_value * weight
    # total value from each row
    total_table = new_table.sum(axis=1)
    # max value from the total
    total_table_max = total_table.max()
    return total_table_max, np.where(total_table == total_table_max)[0].tolist()[0]

